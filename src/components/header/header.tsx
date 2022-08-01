import { IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import { FC } from "react";

interface HeaderProps {
  title: string;
}

export const Header: FC<HeaderProps> = (props) => {
  const { title } = props;
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {title}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
    </>
  );
};
