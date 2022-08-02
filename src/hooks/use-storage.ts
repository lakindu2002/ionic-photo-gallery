import { Directory, Filesystem } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Image } from '../types/image';

export enum PushingDirectory {
    PHOTOS = 'photo',
}


export const useStorage = () => {
    const writeFile = async (fileNameWithFormat: string, base64Data: string) => {
        await Filesystem.writeFile({
            data: base64Data,
            path: fileNameWithFormat,
            directory: Directory.Data, // data directory -> Files directory on Android, documents on iOS
        });
    }

    const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });

    const convertWebPathToBase64 = async (webPath: string) => {
        const response = await fetch(webPath);
        const blob = await response.blob();
        const base64String = await convertBlobToBase64(blob);
        return base64String;
    }

    const pushReferencesToStorage = async (references: Image[], directory: PushingDirectory) => {
        await Storage.set({
            key: directory,
            value: JSON.stringify(references),
        })
    }

    const loadImagesFromStorage = async (directory: PushingDirectory) => {
        const resp = await Storage.get({
            key: directory
        });
        const parsedImages = JSON.parse(resp.value as string) as Image[];
        // read each image ref from file system
        const readPromises = parsedImages.map(async (image) => {
            const fileInFileSystem = await Filesystem.readFile({
                path: image.filePath,
                directory: Directory.Data,
            });
            const newImage: Image = {
                filePath: image.filePath,
                // construct base 64
                webPath: `data:image/jpeg;base64,${fileInFileSystem.data}`,
            }
            return newImage;
        });
        const readImages = await Promise.all(readPromises);
        return readImages;
    };
    return { writeFile, convertWebPathToBase64, pushReferencesToStorage, loadImagesFromStorage };
}