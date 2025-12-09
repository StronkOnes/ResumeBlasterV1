import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

/**
 * Saves a base64 encoded file to the device and shares it
 */
export const saveAndShareBase64 = async (base64Data: string, filename: string, mimeType: string): Promise<boolean> => {
  try {
    const fileUri = FileSystem.documentDirectory + filename;
    
    await FileSystem.writeAsStringAsync(fileUri, base64Data, { 
      encoding: FileSystem.EncodingType.Base64 
    });

    // Check if the file can be shared
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
      return true;
    } else {
      console.log('Sharing is not available on this device');
      return false;
    }
  } catch (error) {
    console.error('Error saving and sharing file:', error);
    return false;
  }
};

/**
 * Downloads a file from a URL and saves it to the device
 */
export const downloadAndSaveFile = async (url: string, filename: string): Promise<boolean> => {
  try {
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      FileSystem.documentDirectory + filename
    );

    const { uri } = await downloadResumable.downloadAsync();
    console.log('File downloaded to:', uri);
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error downloading and saving file:', error);
    return false;
  }
};

/**
 * Picks a document from the device
 */
export const pickDocument = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*', // This allows all file types, you can specify specific types if needed
    });
    
    if (result.type === 'success') {
      return {
        uri: result.uri,
        name: result.name,
        size: result.size,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error picking document:', error);
    return null;
  }
};

/**
 * Checks if a file exists
 */
export const fileExists = async (fileUri: string): Promise<boolean> => {
  try {
    const info = await FileSystem.getInfoAsync(fileUri);
    return info.exists;
  } catch (error) {
    console.error('Error checking if file exists:', error);
    return false;
  }
};

/**
 * Deletes a file
 */
export const deleteFile = async (fileUri: string): Promise<boolean> => {
  try {
    await FileSystem.deleteAsync(fileUri);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Gets file info
 */
export const getFileInfo = async (fileUri: string) => {
  try {
    return await FileSystem.getInfoAsync(fileUri);
  } catch (error) {
    console.error('Error getting file info:', error);
    return null;
  }
};