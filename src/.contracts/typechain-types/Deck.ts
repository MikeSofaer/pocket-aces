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
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface DeckInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "drawCard"
      | "getCardString"
      | "lastDrawnCard"
      | "shuffleDeck"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "drawCard", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getCardString",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "lastDrawnCard",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "shuffleDeck",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "drawCard", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getCardString",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lastDrawnCard",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "shuffleDeck",
    data: BytesLike
  ): Result;
}

export interface Deck extends BaseContract {
  connect(runner?: ContractRunner | null): Deck;
  waitForDeployment(): Promise<this>;

  interface: DeckInterface;

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

  drawCard: TypedContractMethod<[], [bigint], "nonpayable">;

  getCardString: TypedContractMethod<
    [cardIndex: BigNumberish],
    [string],
    "view"
  >;

  lastDrawnCard: TypedContractMethod<[], [bigint], "view">;

  shuffleDeck: TypedContractMethod<[], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "drawCard"
  ): TypedContractMethod<[], [bigint], "nonpayable">;
  getFunction(
    nameOrSignature: "getCardString"
  ): TypedContractMethod<[cardIndex: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "lastDrawnCard"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "shuffleDeck"
  ): TypedContractMethod<[], [void], "nonpayable">;

  filters: {};
}
