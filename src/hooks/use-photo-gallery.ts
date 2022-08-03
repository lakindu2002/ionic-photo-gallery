import { useCallback, useEffect, useState } from "react";
import { Image } from "../types/image";
import { useCamera } from "./use-camera";
import { PushingDirectory, useStorage } from "./use-storage";

export const usePhotoGallery = () => {
    const {
        writeFile,
        convertWebPathToBase64,
        pushReferencesToStorage,
        loadImagesFromStorage,
    } = useStorage();
    const [takePhoto] = useCamera();
    const [capturedPhotos, setCapturedPhotos] = useState<Image[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const loadFromGallery = useCallback(async () => {
        setLoading(true);
        const images = await loadImagesFromStorage(PushingDirectory.PHOTOS);
        setCapturedPhotos(images);
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadFromGallery();
    }, [loadFromGallery]);

    useEffect(() => {
        return () => {
            // cleanup function when the component is unmounted
            setCapturedPhotos([]);
        }
    }, []);

    const capturePhotoAndSave = async () => {
        const photo = await takePhoto();
        const base64ImageUrn = await convertWebPathToBase64(
            photo.webPath as string
        );
        const fileName = new Date().getTime() + ".jpeg";
        await writeFile(fileName, base64ImageUrn as string);
        const capturedPhoto: Image = {
            filePath: fileName,
            webPath: photo.webPath as string,
        };
        const newlyCapturedPhotos = [capturedPhoto, ...capturedPhotos];
        setCapturedPhotos(newlyCapturedPhotos);
        await pushReferencesToStorage(newlyCapturedPhotos, PushingDirectory.PHOTOS);
    };

    return { capturedPhotos, capturePhotoAndSave, loading };
};
