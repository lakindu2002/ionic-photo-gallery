import { Capacitor } from "@capacitor/core";
import { Filesystem } from "@capacitor/filesystem";
import { isPlatform } from "@ionic/core";
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
        try {
            setLoading(true);
            const images = await loadImagesFromStorage(PushingDirectory.PHOTOS);
            setCapturedPhotos(images);
        }
        catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadFromGallery();
    }, [loadFromGallery]);

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

    return { capturedPhotos, capturePhotoAndSave, loading };
};
