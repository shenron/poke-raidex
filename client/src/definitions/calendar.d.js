// @flow

export type EventType = {|
  id: string,
  name: string,
  start: ?string,
  end: ?string,
  color: string,
  type: 'DEFAULT' | 'INFO',
|};
