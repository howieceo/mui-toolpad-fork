import type * as React from 'react';
import { PropDefinitions } from '@mui/studio-core';
import type { Branded, WithControlledProp } from './utils/types';
import type propTypes from './studioPropTypes';
import type { Rectangle } from './utils/geometry';

export type TypeIdentifier = keyof typeof propTypes;

export interface DefaultNodeProps {
  [prop: string]: unknown;
}

export interface EditorProps<T> {
  name: string;
  disabled?: boolean;
  value: T;
  onChange: (newValue: T) => void;
}

export interface PropTypeDefinition<T> {
  Editor: React.FC<EditorProps<T>>;
}

export type PropTypeOf<T extends PropTypeDefinition<any>> = T extends PropTypeDefinition<infer U>
  ? U
  : never;

export interface StudioNodeBindings {
  [destProp: string]: string;
}

export interface StudioPageBindings {
  [destNodeId: NodeId]: StudioNodeBindings | undefined;
}

export interface StudioStateDefinition {
  name: string;
  initialValue: any;
  // TODO: state type?
}

export interface StudioBoundProp {
  type: 'binding';
  state: string;
}

export interface StudioConstantProp<V> {
  type: 'const';
  value: V;
}

export type StudioNodeProp<V> = StudioConstantProp<V> | StudioBoundProp;

export type StudioNodeProps<P = DefaultNodeProps> = {
  readonly [K in Exclude<keyof P, 'children'>]: StudioNodeProp<P[K]> | undefined;
};

export type NodeId = Branded<string, 'NodeId'>;

export interface StudioNode<P = DefaultNodeProps> {
  readonly id: NodeId;
  readonly parentId: NodeId | null;
  readonly component: string;
  readonly name: string;
  readonly props: Partial<StudioNodeProps<P>>;
  readonly children: NodeId[];
}

export interface StudioPageSummary {
  id: string;
}

export interface GridSlot {
  span: number;
  content: NodeId | null;
}

export interface StudioNodes {
  [id: NodeId]: StudioNode | undefined;
}

export interface StudioPageQuery<Q> {
  connectionId: string;
  query: Q;
}

export interface StudioPage extends StudioPageSummary {
  nodes: StudioNodes;
  root: NodeId;
  state: Record<string, StudioStateDefinition>;
  queries: {
    [id: string]: StudioPageQuery<any> | undefined;
  };
}

export type FlowDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';

export interface SlotLocation {
  nodeId: NodeId;
  slot: string;
  index: number;
}

export type PropsAction =
  | {
      type: 'FILL_SLOT';
      nodeId: NodeId;
      slot: string;
      index: number;
    }
  | {
      type: 'CLEAR_SLOT';
      nodeId: NodeId;
    };

export type NodeReducer<P> = (props: StudioNode<P>, action: PropsAction) => StudioNode<P>;

export interface CodeGenContext {
  addImport: (moduleId: string, importedName: string, alias?: string) => void;
  renderNode: (nodeId: NodeId) => string;
  renderProps: (resolvedProps: Record<string, string>) => string;
  renderSlots(name: string, direction: string | undefined): string;
  renderPlaceholder(name: string): string;
}

export interface StudioComponentDefinition<P = DefaultNodeProps> {
  props: PropDefinitions<P>;
  module: string;
  importedName: string;
}

export interface StudioComponentDefinitions {
  readonly [id: string]: StudioComponentDefinition<any> | undefined;
}

export interface SlotLayoutCenter {
  type: 'slot';
  name: string;
  index: number;
  rect: Rectangle;
}

export type SlotDirection = 'horizontal' | 'vertical';

export interface SlotLayoutInsert {
  type: 'insert';
  name: string;
  index: number;
  direction: SlotDirection;
  x: number;
  y: number;
  size: number;
}

export type SlotLayout = SlotLayoutCenter | SlotLayoutInsert;

export interface NodeLayout {
  nodeId: NodeId;
  rect: Rectangle;
  slots: SlotLayout[];
}

export interface ViewLayout {
  [nodeId: NodeId]: NodeLayout | undefined;
}

export interface SqlDataQuery {
  connection: 'sql';
  query: string;
  params: {
    [key: string]: any;
  };
}

export interface MovieDataQuery {
  connection: 'movies';
  genre: string | null;
}

export type DataQuery = SqlDataQuery | MovieDataQuery;

export type QueryResultFields<D = {}> = {
  [K in keyof D]?: {
    type: string;
  };
};

export interface QueryEditorProps<Q> {
  value: Q;
  onChange: (newQuery: Q) => void;
}

export interface StudioQueryResult<D = {}> {
  fields: QueryResultFields<D>;
  data: D[];
}

export type StudioConnectionParamsEditor<P = {}> = React.FC<WithControlledProp<P>>;
export type StudioQueryEditor<Q = {}> = React.FC<WithControlledProp<Q>>;

export interface ConnectionStatus {
  timestamp: number;
  error?: string;
}

export interface StudioDataSourceClient<P = {}, Q = {}> {
  displayName: string;
  needsConnection: boolean;
  ConnectionParamsInput: StudioConnectionParamsEditor<P>;
  getInitialConnectionValue: () => P;
  isConnectionValid: (connection: P) => boolean;
  QueryEditor: StudioQueryEditor<Q>;
  getInitialQueryValue: () => Q;
}

export interface StudioDataSourceServer<P = {}, Q = {}, D = {}> {
  test: (connection: StudioConnection<P>) => Promise<ConnectionStatus>;
  query: (connection: StudioConnection<P>, query: Q) => Promise<StudioQueryResult<D>>;
}

export interface StudioConnectionSummary {
  id: string;
  type: string;
  name: string;
}

export interface StudioConnection<P = {}> extends StudioConnectionSummary {
  params: P;
  status: ConnectionStatus | null;
}
