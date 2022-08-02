import { IonCard } from "@ionic/react";
import { FC } from "react";

interface ImageProps {
  src: string;
}

export const Image: FC<ImageProps> = ({ src }) => {
  return (
    <>
      <IonCard>
        <img
          src={src}
        />
      </IonCard>
    </>
  );
};
