import {ApolloLink} from '@apollo/client/core';
import {RequestHandler} from '@apollo/client/link/core/types';

const formatMessage = (operationType, operation, ellapsed) => {
  const headerCss = [
    'color: gray; font-weight: lighter', // title
    `color: ${operationType === 'query' ? '#03A9F4' : 'red'};`, // operationType
    'color: inherit;', // operationName
  ];

  const parts = [
    '%c apollo',
    `%c${operationType}`,
    `%c${operation.operationName}`,
  ];

  if (operationType !== 'subscription') {
    parts.push(`%c(in ${ellapsed} ms)`);
    headerCss.push('color: gray; font-weight: lighter;'); // time
  }

  return [parts.join(' '), ...headerCss];
};

export class LoggerService extends ApolloLink {
  constructor() {
    super((operation, forward) => {
      const startTime = new Date().getTime();

      return forward(operation).map(result => {
        // @ts-ignore
        const operationType = operation.query.definitions[0].operation;
        const ellapsed = new Date().getTime() - startTime;

        const group = formatMessage(operationType, operation, ellapsed);

        console.groupCollapsed(...group);

        console.log('INIT', operation);
        console.log('RESULT', result);

        console.groupEnd();
        return result;
      });
    });
  }

  concat(next: ApolloLink | RequestHandler): ApolloLink {
    return super.concat(next);
  }
}
