-- Drop the function if it already exists (optional, in case you need to update it)
DROP FUNCTION IF EXISTS get_admin_dashboard_metrics();

-- Create a function that runs with elevated permissions to bypass RLS
CREATE OR REPLACE FUNCTION get_admin_dashboard_metrics()
RETURNS TABLE(
    total_users BIGINT,
    total_resumes BIGINT,
    resumes_today BIGINT,
    resumes_this_week BIGINT,
    resumes_this_month BIGINT,
    active_users_today BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER -- This allows the function to bypass Row Level Security
AS $$
BEGIN
  RETURN QUERY
  SELECT
    -- Count of unique users who have created resumes
    (SELECT COUNT(DISTINCT user_id) FROM public.resumes WHERE user_id IS NOT NULL)::BIGINT as total_users,
    -- Total count of all resumes
    (SELECT COUNT(*) FROM public.resumes)::BIGINT as total_resumes,
    -- Count of resumes created today
    (SELECT COUNT(*) FROM public.resumes WHERE generated_at >= CURRENT_DATE AND generated_at < CURRENT_DATE + INTERVAL '1 day')::BIGINT as resumes_today,
    -- Count of resumes created in the last 7 days
    (SELECT COUNT(*) FROM public.resumes WHERE generated_at >= CURRENT_DATE - INTERVAL '7 days')::BIGINT as resumes_this_week,
    -- Count of resumes created in the last 30 days
    (SELECT COUNT(*) FROM public.resumes WHERE generated_at >= CURRENT_DATE - INTERVAL '30 days')::BIGINT as resumes_this_month,
    -- Count of unique users who created resumes today
    (SELECT COUNT(DISTINCT user_id) FROM public.resumes WHERE generated_at >= CURRENT_DATE AND generated_at < CURRENT_DATE + INTERVAL '1 day' AND user_id IS NOT NULL)::BIGINT as active_users_today;
END;
$$;

-- Grant execute permission to the anon role so your frontend can call this function
GRANT EXECUTE ON FUNCTION get_admin_dashboard_metrics TO anon;

-- Optional: Create a more comprehensive function that includes other metrics needed by the dashboard
CREATE OR REPLACE FUNCTION get_comprehensive_admin_metrics()
RETURNS TABLE(
    total_users BIGINT,
    total_resumes BIGINT,
    resumes_today BIGINT,
    resumes_this_week BIGINT,
    resumes_this_month BIGINT,
    active_users_today BIGINT,
    most_used_template TEXT,
    most_used_mode TEXT,
    avg_resumes_per_user DECIMAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH user_stats AS (
    SELECT COUNT(DISTINCT user_id) as unique_user_count
    FROM public.resumes
    WHERE user_id IS NOT NULL
  ),
  resume_stats AS (
    SELECT
      COUNT(*) as total_resume_count,
      COUNT(CASE WHEN generated_at >= CURRENT_DATE AND generated_at < CURRENT_DATE + INTERVAL '1 day' THEN 1 END) as today_count,
      COUNT(CASE WHEN generated_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as week_count,
      COUNT(CASE WHEN generated_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as month_count,
      COUNT(DISTINCT CASE WHEN generated_at >= CURRENT_DATE AND generated_at < CURRENT_DATE + INTERVAL '1 day' THEN user_id END) as active_today_count
    FROM public.resumes
  ),
  top_template AS (
    SELECT template_selected
    FROM public.resumes
    WHERE template_selected IS NOT NULL
    GROUP BY template_selected
    ORDER BY COUNT(*) DESC
    LIMIT 1
  ),
  top_mode AS (
    SELECT enhancement_mode
    FROM public.resumes
    WHERE enhancement_mode IS NOT NULL
    GROUP BY enhancement_mode
    ORDER BY COUNT(*) DESC
    LIMIT 1
  )
  SELECT
    COALESCE(u.unique_user_count, 0)::BIGINT as total_users,
    COALESCE(r.total_resume_count, 0)::BIGINT as total_resumes,
    COALESCE(r.today_count, 0)::BIGINT as resumes_today,
    COALESCE(r.week_count, 0)::BIGINT as resumes_this_week,
    COALESCE(r.month_count, 0)::BIGINT as resumes_this_month,
    COALESCE(r.active_today_count, 0)::BIGINT as active_users_today,
    t.template_selected as most_used_template,
    m.enhancement_mode as most_used_mode,
    CASE
      WHEN COALESCE(u.unique_user_count, 0) > 0
      THEN (COALESCE(r.total_resume_count, 0)::DECIMAL / u.unique_user_count)
      ELSE 0
    END as avg_resumes_per_user
  FROM user_stats u
  CROSS JOIN resume_stats r
  LEFT JOIN top_template t ON true
  LEFT JOIN top_mode m ON true;
END;
$$;

-- Grant execute permission for the comprehensive metrics function
GRANT EXECUTE ON FUNCTION get_comprehensive_admin_metrics TO anon;

COMMIT;
