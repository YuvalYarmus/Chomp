export type User = {
  id: string;
  name: string;
  room: string;
  created?: any;
};

export type Room = {
  population: number;
  uuid: string;
  moves?: string[];
  users: User[];
  n: number;
  m: number;
  currTurn: number;
  chat?: Chat;
  created? : any;
  isNew? : boolean;
};

export type Chat = {
  messages: Message[];
};

export type Message = {
  message: string;
  time: any;
  sender: string;
};

export type Move = {
  move: string;
  by: string;
  time: any;
};
