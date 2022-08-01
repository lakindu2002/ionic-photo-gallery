import { IonContent, IonPage } from '@ionic/react';
import { Header } from '../components/header/header';

const GalleryTab: React.FC = () => {
  return (
    <IonPage>
      <Header title='Photo Gallery' />
      <IonContent fullscreen={false}>
      </IonContent>
    </IonPage>
  );
};

export default GalleryTab;
