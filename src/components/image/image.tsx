import { IonCard } from "@ionic/react";
import { FC } from "react";

interface ImageProps {
  src: string;
  handleImageClick: () => void;
}

export const Image: FC<ImageProps> = ({ src, handleImageClick }) => {
  return (
    <>
      <IonCard
        onClick={handleImageClick}
      >
        <img
          src={src}
        />
      </IonCard>
    </>
  );
};
