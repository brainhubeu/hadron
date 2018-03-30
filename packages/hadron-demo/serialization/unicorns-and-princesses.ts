export const unicorns = {
  arthur: {
    hornLength: '20',
    id: '10002',
    magicPower: {
      magicSchool: 'Fake',
      name: 'Power of Truth',
      power: '12',
      usability: '0',
    },
    name: 'RainbowHoof',
    price: '2100',
    secretName: 'RainbowFart',
  },
  cssdash: {
    hornLength: '13',
    id: 'd4sh',
    magicPower: {
      magicSchool: 'CSS',
      name: 'Power of Vertically Align Things',
      power: '8',
      usability: '100',
    },
    name: 'Css Dash',
    price: '10000',
    psychologyProfile: 'Suicide Thoughts',
  },
};

export class Princess {
  public address: any = null;
  public friends: any = null;
  public id: any = null;
  public money: any = null;
  public name: any = null;

  constructor({ address, friends, id, money, name }: any) {
    this.address = address;
    this.friends = friends;
    this.id = id;
    this.money = money;
    this.name = name;
  }
}

export const princesses = {
  jasmine: new Princess({
    address: 'Górnych Wałów 26/5',
    friends: [
      { name: 'Francesca', salary: '5120', profession: 'Cooker', id: '123' },
      { name: 'Marina', salary: '2010', profession: 'Gardener' },
      { name: 'Robin', salary: '0', profession: 'Crime Fighter' },
    ],
    id: '10002',
    money: '21000',
    name: 'Jasmine',
  }),
  veronica: new Princess({
    address: 'Red Lanterns 66/6',
    friends: [
      {
        name: 'Hilary',
        salary: '6000',
        profession: 'Not President',
        id: '123',
      },
      {
        name: 'Andrzej L',
        salary: '3678.23',
        profession: 'Farmer',
        lpr: false,
      },
    ],
    id: 'RT123',
    money: '12000',
    name: 'Veronic',
  }),
  jozin: new Princess({
    address: 'Bazin',
    friends: [],
    id: '222',
    money: 0,
    name: 'Jozin',
  }),
};
