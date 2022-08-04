import { Capacitor } from "@capacitor/core";
import { Filesystem } from "@capacitor/filesystem";
import { isPlatform } from "@ionic/core";
import { useEffect, useState } from "react";
import { Image } from "../types/image";
import { useCamera } from "./use-camera";
import { PushingDirectory, useStorage } from "./use-storage";

export const usePhotoGallery = () => {
    const {
        writeFile,
        convertWebPathToBase64,
        pushReferencesToStorage,
        loadImagesFromStorage,
        deleteFile
    } = useStorage();
    const [takePhoto] = useCamera();
    const [capturedPhotos, setCapturedPhotos] = useState<Image[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadFromGallery = async () => {
            setLoading(true);
            const images = await loadImagesFromStorage(PushingDirectory.PHOTOS);
            setCapturedPhotos(images);
            setLoading(false);
        }
        loadFromGallery();
    }, [])

    const capturePhotoAndSave = async () => {
        const isHybrid = isPlatform("hybrid");
        const photo = await takePhoto();
        let base64DataToWrite: string = '';
        if (isHybrid) {
            const readFile = await Filesystem.readFile({
                path: photo.path!,
            })
            base64DataToWrite = readFile.data
        } else {
            base64DataToWrite = await convertWebPathToBase64(
                photo.webPath as string
            ) as string;
        }
        const fileName = new Date().getTime() + ".jpeg";
        const writtenResp = await writeFile(fileName, base64DataToWrite as string);
        const capturedPhoto: Image = {
            filePath: isHybrid ? writtenResp.uri : fileName,
            webPath: isHybrid ? Capacitor.convertFileSrc(writtenResp.uri) : photo.webPath as string,
        };
        const newlyCapturedPhotos = [capturedPhoto, ...capturedPhotos];
        setCapturedPhotos(newlyCapturedPhotos);
        await pushReferencesToStorage(newlyCapturedPhotos, PushingDirectory.PHOTOS);
    };

    const deleteFromGallery = async (image: Image) => {
        const newPhotos = capturedPhotos.filter((photo) => photo.filePath !== image.filePath);
        const filename = image.filePath.substring(image.filePath.lastIndexOf('/') + 1);
        await Promise.all([deleteFile(filename), pushReferencesToStorage(newPhotos, PushingDirectory.PHOTOS)]);
        setCapturedPhotos(newPhotos);
    }

    return { capturedPhotos, capturePhotoAndSave, loading, deleteFromGallery };
};
