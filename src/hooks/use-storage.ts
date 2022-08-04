import { Directory, Filesystem } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { isPlatform } from '@ionic/core';
import { Image } from '../types/image';

export enum PushingDirectory {
    PHOTOS = 'photo',
}


export const useStorage = () => {
    const writeFile = async (fileNameWithFormat: string, base64Data: string) => {
        const resp = await Filesystem.writeFile({
            data: base64Data,
            path: fileNameWithFormat,
            directory: Directory.Data, // data directory -> Files directory on Android, documents on iOS
        });
        return resp;
    }

    const deleteFile = async (fileNameWithFormat: string) => {
        await Filesystem.deleteFile({
            path: fileNameWithFormat,
            directory: Directory.Data,
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
        await Preferences.set({
            key: directory,
            value: JSON.stringify(references),
        })
    }

    const loadImagesFromStorage = async (directory: PushingDirectory) => {
        const resp = await Preferences.get({
            key: directory
        });
        if (resp.value === null) {
            return [];
        }
        const parsedImages = JSON.parse(resp.value) as Image[];
        if (isPlatform('hybrid')) {
            // when in hybrid mode, we can directly view the images in the gallery from filesystem
            return parsedImages;
        }
        // read each image ref from file system and convert it to base 64 if in web
        // If running on the web...
        if (!isPlatform('hybrid')) {
            for (let photo of parsedImages) {
                const file = await Filesystem.readFile({
                    path: photo.filePath,
                    directory: Directory.Data,
                });
                // Web platform only: Load the photo as base64 data
                photo.webPath = `data:image/jpeg;base64,${file.data}`;
            }
        }
        return parsedImages;
    };
    return { writeFile, convertWebPathToBase64, pushReferencesToStorage, loadImagesFromStorage, deleteFile };
}