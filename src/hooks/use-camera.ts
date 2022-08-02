import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export const useCamera = () => {
    const takePhoto = async () => {
        const capturedPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera, // launch the camera
            quality: 100, // highest quality
            allowEditing: true,
        });
        return capturedPhoto;
    }
    return [takePhoto];
}