import { IonContent, IonFab, IonFabButton, IonIcon, IonPage } from '@ionic/react';
import { Header } from '../components/header/header';
import { camera } from 'ionicons/icons';
import React, { FC, useState } from 'react';
import { useCamera } from '../hooks/use-camera';
import { Photo } from '@capacitor/camera';
import { Image } from '../types/image';

const GalleryTab: FC = () => {
  const [photos, setPhotos] = useState<Image[]>([]);
  const [takePhoto] = useCamera();

  const handleOnCameraClick = async () => {
    try {
      const photo: Photo = await takePhoto();
      setPhotos([...photos, { format: photo.format, webPath: photo.webPath as string }]);
    } catch (err) {
      console.log((err as any).message)
    }
  };

  return (
    <IonPage>
      <Header title='Photo Gallery' />
      <IonContent fullscreen={false}>
        <IonFab
          vertical='bottom'
          horizontal='center'
        >
          <IonFabButton
            onClick={handleOnCameraClick}
          >
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default GalleryTab;
