import { IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import { FC, Fragment } from "react";

interface HeaderProps {
  title: string;
  endIcon?: JSX.Element
}

export const Header: FC<HeaderProps> = (props) => {
  const { title, endIcon } = props;
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <IonTitle>
              {title}
            </IonTitle>
            {endIcon && (
              <Fragment>
                {endIcon}
              </Fragment>
            )}
          </div>
        </IonToolbar>
      </IonHeader>
    </>
  );
};
