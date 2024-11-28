import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import { ProcessingError } from './errors';

export async function uploadResumeToStorage(file: File, userId: string): Promise<string> {
  try {
    if (!storage) {
      throw new ProcessingError('Storage is not initialized');
    }

    const storageRef = ref(storage, `resumes/${userId}/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    throw new ProcessingError(
      'Failed to upload resume. Please try again or contact support if the problem persists.'
    );
  }
}