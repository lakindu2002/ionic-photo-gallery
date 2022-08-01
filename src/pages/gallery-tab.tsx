import { IonContent, IonFab, IonFabButton, IonIcon, IonPage } from '@ionic/react';
import { Header } from '../components/header/header';
import { camera } from 'ionicons/icons';
import React, { FC } from 'react';

const GalleryTab: FC = () => {

  const handleOnCameraClick = () => {
    console.log('clicked');
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
