import React from 'react';
import { AxiosResponse } from 'axios';
import { Message } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

interface IProps {
  error: AxiosResponse;
  text?: string;
}

const ErrorMessage: React.FC<IProps> = ({ error, text }) => {
  return (
    <Message error>
      <Message.Header>{error.statusText}</Message.Header>
      {error.data && error.data.errors && Object.keys(error.data.errors).length > 0 && (
        <Message.List>
          {Object.values(error.data.errors).flat().map((err : any, i) => (
            <Message.Item key={i}>{err}</Message.Item>
          ))}
        </Message.List>
      )}
      {text && <Message.Content content={text} />}
    </Message>
  );
};

export default observer(ErrorMessage);
