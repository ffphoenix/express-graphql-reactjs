import revisionsManager from "../revisionsManager";
import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();
export const storage = new revisionsManager(pubsub);