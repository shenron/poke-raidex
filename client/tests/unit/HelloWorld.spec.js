// @flow

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg:string = 'new message';
    expect('new message').toMatch(msg);
  });
});
