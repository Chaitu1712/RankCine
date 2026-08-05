import { ConnectorConfig, DataConnect, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  id: string;
  email: string;
  role: string;
  status: string;
}

export interface MediaItem_Key {
  id: UUIDString;
  __typename?: 'MediaItem_Key';
}

export interface MediaParameter_Key {
  id: UUIDString;
  __typename?: 'MediaParameter_Key';
}

export interface ModerationQueue_Key {
  id: UUIDString;
  __typename?: 'ModerationQueue_Key';
}

export interface Producer_Key {
  id: UUIDString;
  __typename?: 'Producer_Key';
}

export interface RegisterProducerData {
  user_insert: User_Key;
  producer_insert: Producer_Key;
}

export interface RegisterProducerVariables {
  id: string;
  email: string;
  role: string;
  companyName: string;
}

export interface ReviewScore_Key {
  reviewId: UUIDString;
  parameterId: UUIDString;
  __typename?: 'ReviewScore_Key';
}

export interface Review_Key {
  id: UUIDString;
  __typename?: 'Review_Key';
}

export interface Reward_Key {
  id: UUIDString;
  __typename?: 'Reward_Key';
}

export interface UserProfile_Key {
  id: UUIDString;
  __typename?: 'UserProfile_Key';
}

export interface UserReward_Key {
  userId: string;
  rewardId: UUIDString;
  __typename?: 'UserReward_Key';
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface RegisterProducerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RegisterProducerVariables): MutationRef<RegisterProducerData, RegisterProducerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RegisterProducerVariables): MutationRef<RegisterProducerData, RegisterProducerVariables>;
  operationName: string;
}
export const registerProducerRef: RegisterProducerRef;

export function registerProducer(vars: RegisterProducerVariables): MutationPromise<RegisterProducerData, RegisterProducerVariables>;
export function registerProducer(dc: DataConnect, vars: RegisterProducerVariables): MutationPromise<RegisterProducerData, RegisterProducerVariables>;

