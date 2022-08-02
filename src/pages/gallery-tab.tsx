import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonPage, IonProgressBar, IonRow } from '@ionic/react';
import { Header } from '../components/header/header';
import { camera } from 'ionicons/icons';
import { FC } from 'react';
import { Image as ImageComponent } from '../components/image/image';
import { usePhotoGallery } from '../hooks/use-photo-gallery';

const GalleryTab: FC = () => {
  const { capturePhotoAndSave, capturedPhotos, loading } = usePhotoGallery();
  const handleOnCameraClick = async () => {
    try {
      await capturePhotoAndSave();
    } catch (err) {
      console.log((err as any).message)
    }
  };

  return (
    <IonPage>
      <Header title='Photo Gallery'
        endIcon={<div style={{ paddingRight: 13 }}><IonButton
          onClick={handleOnCameraClick}
          color={'primary'}
        >
          <IonIcon icon={camera} />
        </IonButton>
        </div>}
      />
      <IonContent fullscreen={false}>
        {
          loading && (
            <IonProgressBar
              color={'primary'}
              type='indeterminate' />
          )
        }

        {
          !loading && (
            <IonGrid>
              <IonRow>
                {
                  capturedPhotos.length === 0 && (
                    <IonCol>
                      <IonItem color='primary'>
                        No photos yet
                      </IonItem>
                    </IonCol>
                  )
                }
                {
                  capturedPhotos.map((photo, photoIdx) => (
                    <IonCol
                      size='4'
                      key={photoIdx}
                    >
                      <ImageComponent
                        src={photo.webPath}
                      />
                    </IonCol>
                  ))
                }
              </IonRow>
            </IonGrid>
          )
        }
      </IonContent>
    </IonPage>
  );
};

export default GalleryTab;
