/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface TexasHoldemInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "callBet"
      | "communityCards"
      | "currentBet"
      | "dealCards"
      | "declareWinner"
      | "fold"
      | "gameStarted"
      | "getCommunityCards"
      | "getHighestBet"
      | "getHoleCards"
      | "getPlayerBet"
      | "joinGame"
      | "placeBet"
      | "playerAddresses"
      | "players"
      | "pot"
      | "raiseBet"
      | "startGame"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "BetPlaced"
      | "CardsDealt"
      | "GameStarted"
      | "JoinedGame"
      | "PlayerFolded"
      | "PotSizeDebug"
      | "WinnerDeclared"
  ): EventFragment;

  encodeFunctionData(functionFragment: "callBet", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "communityCards",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "currentBet",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "dealCards", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "declareWinner",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "fold", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "gameStarted",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getCommunityCards",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getHighestBet",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getHoleCards",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPlayerBet",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "joinGame", values?: undefined): string;
  encodeFunctionData(functionFragment: "placeBet", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "playerAddresses",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "players",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "pot", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "raiseBet",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "startGame", values?: undefined): string;

  decodeFunctionResult(functionFragment: "callBet", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "communityCards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "currentBet", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "dealCards", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "declareWinner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "fold", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "gameStarted",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCommunityCards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getHighestBet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getHoleCards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPlayerBet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "joinGame", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "placeBet", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "playerAddresses",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "players", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pot", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "raiseBet", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "startGame", data: BytesLike): Result;
}

export namespace BetPlacedEvent {
  export type InputTuple = [player: AddressLike, amount: BigNumberish];
  export type OutputTuple = [player: string, amount: bigint];
  export interface OutputObject {
    player: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace CardsDealtEvent {
  export type InputTuple = [];
  export type OutputTuple = [];
  export interface OutputObject {}
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace GameStartedEvent {
  export type InputTuple = [];
  export type OutputTuple = [];
  export interface OutputObject {}
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace JoinedGameEvent {
  export type InputTuple = [player: AddressLike, betAmount: BigNumberish];
  export type OutputTuple = [player: string, betAmount: bigint];
  export interface OutputObject {
    player: string;
    betAmount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PlayerFoldedEvent {
  export type InputTuple = [player: AddressLike];
  export type OutputTuple = [player: string];
  export interface OutputObject {
    player: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PotSizeDebugEvent {
  export type InputTuple = [potAmount: BigNumberish, winner: AddressLike];
  export type OutputTuple = [potAmount: bigint, winner: string];
  export interface OutputObject {
    potAmount: bigint;
    winner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WinnerDeclaredEvent {
  export type InputTuple = [winner: AddressLike, winnings: BigNumberish];
  export type OutputTuple = [winner: string, winnings: bigint];
  export interface OutputObject {
    winner: string;
    winnings: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface TexasHoldem extends BaseContract {
  connect(runner?: ContractRunner | null): TexasHoldem;
  waitForDeployment(): Promise<this>;

  interface: TexasHoldemInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  callBet: TypedContractMethod<[], [void], "payable">;

  communityCards: TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;

  currentBet: TypedContractMethod<[], [bigint], "view">;

  dealCards: TypedContractMethod<[], [void], "nonpayable">;

  declareWinner: TypedContractMethod<[], [void], "nonpayable">;

  fold: TypedContractMethod<[], [void], "nonpayable">;

  gameStarted: TypedContractMethod<[], [boolean], "view">;

  getCommunityCards: TypedContractMethod<
    [],
    [[bigint, bigint, bigint, bigint, bigint]],
    "view"
  >;

  getHighestBet: TypedContractMethod<[], [bigint], "view">;

  getHoleCards: TypedContractMethod<[], [[bigint, bigint]], "view">;

  getPlayerBet: TypedContractMethod<[player: AddressLike], [bigint], "view">;

  joinGame: TypedContractMethod<[], [void], "payable">;

  placeBet: TypedContractMethod<[], [void], "payable">;

  playerAddresses: TypedContractMethod<[arg0: BigNumberish], [string], "view">;

  players: TypedContractMethod<
    [arg0: AddressLike],
    [
      [string, bigint, bigint, boolean, boolean] & {
        addr: string;
        balance: bigint;
        betAmount: bigint;
        isActive: boolean;
        hasFolded: boolean;
      }
    ],
    "view"
  >;

  pot: TypedContractMethod<[], [bigint], "view">;

  raiseBet: TypedContractMethod<[raiseAmount: BigNumberish], [void], "payable">;

  startGame: TypedContractMethod<[], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "callBet"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "communityCards"
  ): TypedContractMethod<[arg0: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "currentBet"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "dealCards"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "declareWinner"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "fold"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "gameStarted"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "getCommunityCards"
  ): TypedContractMethod<
    [],
    [[bigint, bigint, bigint, bigint, bigint]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getHighestBet"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getHoleCards"
  ): TypedContractMethod<[], [[bigint, bigint]], "view">;
  getFunction(
    nameOrSignature: "getPlayerBet"
  ): TypedContractMethod<[player: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "joinGame"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "placeBet"
  ): TypedContractMethod<[], [void], "payable">;
  getFunction(
    nameOrSignature: "playerAddresses"
  ): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "players"
  ): TypedContractMethod<
    [arg0: AddressLike],
    [
      [string, bigint, bigint, boolean, boolean] & {
        addr: string;
        balance: bigint;
        betAmount: bigint;
        isActive: boolean;
        hasFolded: boolean;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "pot"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "raiseBet"
  ): TypedContractMethod<[raiseAmount: BigNumberish], [void], "payable">;
  getFunction(
    nameOrSignature: "startGame"
  ): TypedContractMethod<[], [void], "nonpayable">;

  getEvent(
    key: "BetPlaced"
  ): TypedContractEvent<
    BetPlacedEvent.InputTuple,
    BetPlacedEvent.OutputTuple,
    BetPlacedEvent.OutputObject
  >;
  getEvent(
    key: "CardsDealt"
  ): TypedContractEvent<
    CardsDealtEvent.InputTuple,
    CardsDealtEvent.OutputTuple,
    CardsDealtEvent.OutputObject
  >;
  getEvent(
    key: "GameStarted"
  ): TypedContractEvent<
    GameStartedEvent.InputTuple,
    GameStartedEvent.OutputTuple,
    GameStartedEvent.OutputObject
  >;
  getEvent(
    key: "JoinedGame"
  ): TypedContractEvent<
    JoinedGameEvent.InputTuple,
    JoinedGameEvent.OutputTuple,
    JoinedGameEvent.OutputObject
  >;
  getEvent(
    key: "PlayerFolded"
  ): TypedContractEvent<
    PlayerFoldedEvent.InputTuple,
    PlayerFoldedEvent.OutputTuple,
    PlayerFoldedEvent.OutputObject
  >;
  getEvent(
    key: "PotSizeDebug"
  ): TypedContractEvent<
    PotSizeDebugEvent.InputTuple,
    PotSizeDebugEvent.OutputTuple,
    PotSizeDebugEvent.OutputObject
  >;
  getEvent(
    key: "WinnerDeclared"
  ): TypedContractEvent<
    WinnerDeclaredEvent.InputTuple,
    WinnerDeclaredEvent.OutputTuple,
    WinnerDeclaredEvent.OutputObject
  >;

  filters: {
    "BetPlaced(address,uint256)": TypedContractEvent<
      BetPlacedEvent.InputTuple,
      BetPlacedEvent.OutputTuple,
      BetPlacedEvent.OutputObject
    >;
    BetPlaced: TypedContractEvent<
      BetPlacedEvent.InputTuple,
      BetPlacedEvent.OutputTuple,
      BetPlacedEvent.OutputObject
    >;

    "CardsDealt()": TypedContractEvent<
      CardsDealtEvent.InputTuple,
      CardsDealtEvent.OutputTuple,
      CardsDealtEvent.OutputObject
    >;
    CardsDealt: TypedContractEvent<
      CardsDealtEvent.InputTuple,
      CardsDealtEvent.OutputTuple,
      CardsDealtEvent.OutputObject
    >;

    "GameStarted()": TypedContractEvent<
      GameStartedEvent.InputTuple,
      GameStartedEvent.OutputTuple,
      GameStartedEvent.OutputObject
    >;
    GameStarted: TypedContractEvent<
      GameStartedEvent.InputTuple,
      GameStartedEvent.OutputTuple,
      GameStartedEvent.OutputObject
    >;

    "JoinedGame(address,uint256)": TypedContractEvent<
      JoinedGameEvent.InputTuple,
      JoinedGameEvent.OutputTuple,
      JoinedGameEvent.OutputObject
    >;
    JoinedGame: TypedContractEvent<
      JoinedGameEvent.InputTuple,
      JoinedGameEvent.OutputTuple,
      JoinedGameEvent.OutputObject
    >;

    "PlayerFolded(address)": TypedContractEvent<
      PlayerFoldedEvent.InputTuple,
      PlayerFoldedEvent.OutputTuple,
      PlayerFoldedEvent.OutputObject
    >;
    PlayerFolded: TypedContractEvent<
      PlayerFoldedEvent.InputTuple,
      PlayerFoldedEvent.OutputTuple,
      PlayerFoldedEvent.OutputObject
    >;

    "PotSizeDebug(uint256,address)": TypedContractEvent<
      PotSizeDebugEvent.InputTuple,
      PotSizeDebugEvent.OutputTuple,
      PotSizeDebugEvent.OutputObject
    >;
    PotSizeDebug: TypedContractEvent<
      PotSizeDebugEvent.InputTuple,
      PotSizeDebugEvent.OutputTuple,
      PotSizeDebugEvent.OutputObject
    >;

    "WinnerDeclared(address,uint256)": TypedContractEvent<
      WinnerDeclaredEvent.InputTuple,
      WinnerDeclaredEvent.OutputTuple,
      WinnerDeclaredEvent.OutputObject
    >;
    WinnerDeclared: TypedContractEvent<
      WinnerDeclaredEvent.InputTuple,
      WinnerDeclaredEvent.OutputTuple,
      WinnerDeclaredEvent.OutputObject
    >;
  };
}
