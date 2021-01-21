export enum Network {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
  Regtest = 'regtest',
}

type Feature = { name: string; support: string /* enum? `optional`, ??? */ };

export enum ChannelState {
  WAIT_FOR_INIT_INTERNAL = 'WAIT_FOR_INIT_INTERNAL',
  WAIT_FOR_OPEN_CHANNEL = 'WAIT_FOR_OPEN_CHANNEL',
  WAIT_FOR_ACCEPT_CHANNEL = 'WAIT_FOR_ACCEPT_CHANNEL',
  WAIT_FOR_FUNDING_INTERNAL = 'WAIT_FOR_FUNDING_INTERNAL',
  WAIT_FOR_FUNDING_CREATED = 'WAIT_FOR_FUNDING_CREATED',
  WAIT_FOR_FUNDING_SIGNED = 'WAIT_FOR_FUNDING_SIGNED',
  WAIT_FOR_FUNDING_CONFIRMED = 'WAIT_FOR_FUNDING_CONFIRMED',
  WAIT_FOR_FUNDING_LOCKED = 'WAIT_FOR_FUNDING_LOCKED',
  NORMAL = 'NORMAL',
  SHUTDOWN = 'SHUTDOWN',
  NEGOTIATING = 'NEGOTIATING',
  CLOSING = 'CLOSING',
  CLOSED = 'CLOSED',
  OFFLINE = 'OFFLINE',
  SYNCING = 'SYNCING',
  WAIT_FOR_REMOTE_PUBLISH_FUTURE_COMMITMENT = 'WAIT_FOR_REMOTE_PUBLISH_FUTURE_COMMITMENT',
  ERR_FUNDING_LOST = 'ERR_FUNDING_LOST',
  ERR_INFORMATION_LEAK = 'ERR_INFORMATION_LEAK',
}

// eclair-cli getinfo
export type GetInfoResponse = {
  version: string;
  nodeId: string;
  alias: string;
  color: string;
  features: {
    activated: Feature[];
    unknown: Feature[];
  };
  chainHash: string;
  network: Network;
  blockHeight: number;
  publicAddresses: string[];
  instanceId: string;
};

// eclair-cli connect --uri=<target_uri>
export type ConnectViaURIRequest = {
  // The URI in format 'nodeId@host:port'
  uri: string;
};
export type ConnectViaURIResponse = string; // enum? `connected`, ???

// eclair-cli connect --nodeId=<node_id> --host=<host>
export type ConnectManuallyRequest = {
  // The nodeId of the node you want to connect to
  nodeId: string;
  // The IPv4 host address of the node
  host: string;
  // The port of the node (default: 9735)
  port?: number;
};
export type ConnectManuallyResponse = string; // enum? `connected`, ???

// eclair-cli connect --nodeId=<nodeId>
export type ConnectViaNodeIdRequest = {
  // The nodeId of the node you want to connect to
  nodeId: string;
};
export type ConnectViaNodeIdResponse = string; // enum? `connected`, ???

// eclair-cli disconnect --nodeId=<nodeId>
export type DisconnectRequest = {
  // The nodeId of the node you want to disconnect from
  nodeId: string;
};
export type DisconnectResponse = string; // enum? `disconnecting`, ???

// eclair-cli open --nodeId=<node_id> --fundingSatoshis=<funding_satoshis> --feeBaseMsat=<feebase> --feeProportionalMillionths=<feeproportional>
export type OpenRequest = {
  // The nodeId of the node you want to connect to
  nodeId: string;
  // Amount of satoshis to spend in the funding of the channel
  fundingSatoshis: string;
  // Amount of millisatoshi to unilaterally push to the counterparty
  pushMsat?: number;
  // The base fee to use when relaying payments
  feeBaseMsat?: number;
  // The proportional fee to use when relaying payments
  feeProportionalMillionths?: number;
  // Feerate in sat/byte to apply to the funding transaction
  fundingFeerateSatByte?: number;
  // Flags for the new channel: 0 = private, 1 = public
  channelFlags?: 0 | 1;
  // Timeout for the operation to complete
  openTimeoutSeconds?: number;
};
export type OpenResponse = string; // e.g. 'created channel e872f515dc5d8a3d61ccbd2127f33141eaa115807271dcc5c5c727f3eca914d3'

// eclair-cli close --channelId=<channel>
export type CloseRequest = {
  // The channelId of the channel you want to close
  channelId: string;
  // The shortChannelId of the channel you want to close
  shortChannelId?: string;
  // List of channelIds to close
  channelIds?: string | string[]; // CSV or JSON list of channelId
  // List of shortChannelIds to close
  shortChannelIds?: string | string[]; // CSV or JSON list of shortChannelId
  // A serialized scriptPubKey that you want to use to close the channel
  scriptPubKey?: string;
};
export type CloseResponse = {
  [key in string]: 'ok'; // enum???
};

// eclair-cli forceclose --channelId=<channel>
export type ForceCloseRequest = {
  // The channelId of the channel you want to close
  channelId: string;
  // The shortChannelId of the channel you want to close
  shortChannelId?: string;
  // List of channelIds to close
  channelIds?: string | string[]; // CSV or JSON list of channelId
  // List of shortChannelIds to close
  shortChannelIds?: string | string[]; // CSV or JSON list of shortChannelId
};
export type ForceCloseResponse = {
  [key in string]: 'ok'; // enum???
};

// eclair-cli updaterelayfee \
//   --channelId=<channel> \
//   --feeBaseMsat=<feebase> \
//   --feeProportionalMillionths=<feeproportional>
export type UpdateRelayFeeRequest = {
  // The channelId of the channel you want to update
  channelId: string;
  // The shortChannelId of the channel you want to update
  shortChannelId?: string;
  // List of channelIds to update
  channelIds?: string | string[]; // CSV or JSON list of channelId
  // List of shortChannelIds to update
  shortChannelIds?: string | string[]; // CSV or JSON list of shortChannelId
  // The new base fee to use
  feeBaseMsat: number; // millisatoshi
  // The new proportional fee to use
  feeProportionalMillionths: number;
};
export type UpdateRelayFeeResponse = {
  [key in string]: 'ok'; // enum???
};

// eclair-cli peers
export type PeersResponse = {
  nodeId: string;
  state: 'CONNECTED' | 'DISCONNECTED';
  address?: string;
  channels: number;
}[];

// eclair-cli channels
export type ChannelsRequest = {
  // The remote node id to be used as filter for the channels
  nodeId?: string;
};
export type ChannelsResponse = [
  {
    nodeId: string;
    channelId: string;
    state: 'NORMAL';
    data: {
      commitments: {
        channelVersion: string;
        localParams: {
          nodeId: string;
          fundingKeyPath: {
            path: number[];
          };
          dustLimit: number;
          maxHtlcValueInFlightMsat: number;
          channelReserve: number;
          htlcMinimum: number;
          toSelfDelay: number;
          maxAcceptedHtlcs: number;
          isFunder: boolean;
          defaultFinalScriptPubKey: string;
          features: {
            activated: Feature[];
            unknown: Feature[];
          };
        };
        remoteParams: {
          nodeId: string;
          dustLimit: number;
          maxHtlcValueInFlightMsat: number;
          channelReserve: number;
          htlcMinimum: number;
          toSelfDelay: number;
          maxAcceptedHtlcs: number;
          fundingPubKey: string;
          revocationBasepoint: string;
          paymentBasepoint: string;
          delayedPaymentBasepoint: string;
          htlcBasepoint: string;
          features: {
            activated: Feature[];
            unknown: Feature[];
          };
        };
        channelFlags: number;
        localCommit: {
          index: number;
          spec: {
            htlcs: []; // TODO: not sure what this data structure looks like
            feeratePerKw: number;
            toLocal: number;
            toRemote: number;
          };
          publishableTxs: {
            commitTx: {
              txid: string;
              tx: string;
            };
            htlcTxsAndSigs: []; // TODO: not sure what this data structure looks like
          };
        };
        remoteCommit: {
          index: number;
          spec: {
            htlcs: [];
            feeratePerKw: number;
            toLocal: number;
            toRemote: number;
          };
          txid: string;
          remotePerCommitmentPoint: string;
        };
        localChanges: {
          proposed: []; // TODO: not sure what this data structure looks like
          signed: []; // TODO: not sure what this data structure looks like
          acked: []; // TODO: not sure what this data structure looks like
        };
        remoteChanges: {
          proposed: []; // TODO: not sure what this data structure looks like
          acked: []; // TODO: not sure what this data structure looks like
          signed: []; // TODO: not sure what this data structure looks like
        };
        localNextHtlcId: number;
        remoteNextHtlcId: number;
        originChannels: Record<string, unknown>; // TODO: not sure what this data structure looks like
        remoteNextCommitInfo: string;
        commitInput: {
          outPoint: string;
          amountSatoshis: number;
        };
        remotePerCommitmentSecrets: null; // TODO: not sure what this data structure looks like
        channelId: string;
      };
      shortChannelId: string;
      buried: boolean;
      channelAnnouncement: {
        nodeSignature1: string;
        nodeSignature2: string;
        bitcoinSignature1: string;
        bitcoinSignature2: string;
        features: {
          activated: Feature[];
          unknown: Feature[];
        };
        chainHash: string;
        shortChannelId: string;
        nodeId1: string;
        nodeId2: string;
        bitcoinKey1: string;
        bitcoinKey2: string;
        unknownFields: string;
      };
      channelUpdate: {
        signature: string;
        chainHash: string;
        shortChannelId: string;
        timestamp: number;
        messageFlags: number;
        channelFlags: number;
        cltvExpiryDelta: number;
        htlcMinimumMsat: number;
        feeBaseMsat: number;
        feeProportionalMillionths: number;
        htlcMaximumMsat: number;
        unknownFields: string;
      };
    };
  }
];

// eclair-cli nodes
export type NodesRequest = {
  // The node ids of the nodes to return
  nodeIds?: string | string[]; // CSV or JSON list of 33-bytes-HexString (String)
};
export type NodesResponse = {
  signature: string;
  features: {
    activated: Feature[];
    unknown: Feature[];
  };
  timestamp: number;
  nodeId: string;
  rgbColor: string;
  alias: string;
  addresses: string[];
  unknownFields: string;
}[];

// eclair-cli allchannels
export type AllChannelsResponse = {
  shortChannelId: string;
  a: string;
  b: string;
}[];

// eclair-cli allupdates
export type AllUpdatesRequest = {
  // The node id of the node to be used as filter for the updates
  nodeId?: string;
};
export type AllUpdatesResponse = {
  signature: string;
  chainHash: string;
  shortChannelId: string;
  timestamp: number;
  messageFlags: number;
  channelFlags: number;
  cltvExpiryDelta: number;
  htlcMinimumMsat: number;
  feeBaseMsat: number;
  feeProportionalMillionths: number;
  htlcMaximumMsat: number;
  unknownFields: string;
}[];

// eclair-cli networkstats
export type NetworkStatsResponse = {
  channels: number;
  nodes: number;
  capacity: {
    median: number;
    percentile5: number;
    percentile10: number;
    percentile25: number;
    percentile75: number;
    percentile90: number;
    percentile95: number;
  };
  cltvExpiryDelta: {
    median: number;
    percentile5: number;
    percentile10: number;
    percentile25: number;
    percentile75: number;
    percentile90: number;
    percentile95: number;
  };
  feeBase: {
    median: number;
    percentile5: number;
    percentile10: number;
    percentile25: number;
    percentile75: number;
    percentile90: number;
    percentile95: number;
  };
  feeProportional: {
    median: number;
    percentile5: number;
    percentile10: number;
    percentile25: number;
    percentile75: number;
    percentile90: number;
    percentile95: number;
  };
};

// eclair-cli createinvoice --description=<some_description> --amountMsat=<some_amount>
export type CreateInvoiceRequest = {
  // A description for the invoice
  description: string;
  // Amount in millisatoshi for this invoice
  amountMsat: number;
  // Number of seconds that the invoice will be valid
  expireIn: number;
  // An on-chain fallback address to receive the payment
  fallbackAddress: string;
  // A user defined input for the generation of the paymentHash
  paymentPreimage: string;
};
export type CreateInvoiceResponse = {
  prefix: string;
  timestamp: number;
  nodeId: string;
  serialized: string;
  description: string;
  paymentHash: string;
  expiry: number;
  amount: number;
  features: {
    activated: Feature[];
    unknown: Feature[];
  };
};

// eclair-cli parseinvoice --invoice=<some_bolt11invoice>
export type ParseInvoiceRequest = {
  // The invoice you want to decode
  invoice: string;
};
export type ParseInvoiceResponse = {
  prefix: string;
  timestamp: number;
  nodeId: string;
  serialized: string;
  description: string;
  paymentHash: string;
  expiry: number;
  amount: number;
  features: {
    activated: Feature[];
    unknown: Feature[];
  };
};

// eclair-cli payinvoice --invoice=<some_invoice>
export type PayInvoiceRequest = {
  // The invoice you want to pay
  invoice: string;
  // Amount to pay if the invoice does not have one
  amountMsat?: number; // Millisatoshi (Integer)
  // Max number of retries
  maxAttempts?: number;
  // Fee threshold to be paid along the payment route
  feeThresholdSat?: number; // Satoshi (Integer)
  // Max percentage to be paid in fees along the payment route
  maxFeePct?: number; // (ignored if below feeThresholdSat) Double
  // Extra payment identifier specified by the caller
  externalId?: string;
};
export type PayInvoiceResponse = string;

// eclair-cli sendtonode --nodeId=<some_node> --amountMsat=<amount> --paymentHash=<some_hash>
export type SendToNodeRequest = {
  // The recipient of this payment
  nodeId: string;
  // Amount to pay
  amountMsat: string; // msat
  // The payment hash for this payment
  paymentHash: string;
  // Max number of retries
  maxAttempts: string;
  // Fee threshold to be paid along the payment route
  feeThresholdSat: string; // sat
  // Max percentage to be paid in fees along the payment route (ignored if below feeThresholdSat)
  maxFeePct: string; // double
  // Extra payment identifier specified by the caller
  externalId?: string; // string
};
export type SendToNodeResponse = string;

// eclair-cli sendtoroute --nodeIds=node1,node2 --amountMsat=<amount> --paymentHash=<some_hash> --finalCltvExpiry=<some_value> --invoice=<some_invoice>
// eclair-cli sendtoroute --shortChannelIds=42x1x0,56x7x3 --amountMsat=<amount> --paymentHash=<some_hash> --finalCltvExpiry=<some_value> --invoice=<some_invoice>
export type SendToRouteRequest = {
  // The invoice you want to pay
  invoice: string;
  // A list of nodeIds from source to destination of the payment	Yes (*)	List of nodeIds
  nodeIds?: string[]; // CSV or JSON list of 33-bytes-HexString (String)
  // A list of shortChannelIds from source to destination of the payment	Yes (*)	List of shortChannelIds
  shortChannelIds?: string[];
  // Amount to pay
  amountMsat: number;
  // The payment hash for this payment
  paymentHash: string;
  // The total CLTV expiry value for this payment	No	Integer
  finalCltvExpiry: number;
  // Total amount that the recipient should receive (if using MPP)	Yes	Millisatoshi (Integer)
  recipientAmountMsat?: number;
  // Id of the whole payment (if using MPP)
  parentId?: string;
  // Extra payment identifier specified by the caller
  externalId?: string;
};
export type SendToRouteResponse = {
  paymentId: string;
  parentId: string;
};

// eclair-cli getsentinfo --paymentHash=<some_hash>
export type GetSentInfoRequest = {
  // The payment hash common to all payment attepts to be retrieved
  paymentHash: string;
  // The unique id of the payment attempt
  id?: string;
};
export type GetSentInfoResponse = {
  id: string;
  parentId: string;
  paymentHash: string;
  paymentType: string;
  amount: number;
  recipientAmount: number;
  recipientNodeId: string;
  createdAt: number;
  paymentRequest: {
    prefix: string;
    timestamp: number;
    nodeId: string;
    serialized: string;
    description: 'prepare MPP';
    paymentHash: string;
    expiry: number;
    amount: number;
    features: {
      activated: Feature[];
      unknown: Feature[];
    };
  };
  status: {
    type: string;
    paymentPreimage: string;
    feesPaid: number;
    route: [
      {
        nodeId: string;
        nextNodeId: string;
        shortChannelId: string;
      },
      {
        nodeId: string;
        nextNodeId: string;
        shortChannelId: string;
      }
    ];
    completedAt: number;
  };
}[];

// eclair-cli getreceivedinfo --paymentHash=<some_hash>
export type GetReceivedInfoRequest = {
  // The payment hash you want to check
  paymentHash: string;
  // The invoice containing the payment hash
  invoice?: string;
};
export type GetReceivedInfoResponse = {
  paymentRequest: {
    prefix: string;
    timestamp: number;
    nodeId: string;
    serialized: string;
    description: string;
    paymentHash: string;
    expiry: number;
    amount: number;
    features: {
      activated: Feature[];
      unknown: Feature[];
    };
  };
  paymentPreimage: string;
  paymentType: string;
  createdAt: number;
  status: {
    type: string;
    amount: number;
    receivedAt: number;
  };
};

// eclair-cli getinvoice --paymentHash=<some_hash>
export type GetInvoiceRequest = {
  // The payment hash of the invoice you want to retrieve
  paymentHash: string;
};
export type GetInvoiceResponse = {
  prefix: string;
  timestamp: number;
  nodeId: string;
  serialized: string;
  description: string;
  paymentHash: string;
  expiry: number;
  amount: number;
  features: {
    activated: Feature[];
    unknown: Feature[];
  };
};

// eclair-cli listinvoices
export type ListInvoicesRequest = {
  // Filters elements no older than this unix-timestamp
  from?: number;
  // Filters elements no younger than this unix-timestamp
  to?: number;
};
export type ListInvoicesResponse = {
  prefix: string;
  timestamp: number;
  nodeId: string;
  serialized: string;
  description: string;
  paymentHash: string;
  expiry: number;
  amount: number;
  features: {
    activated: Feature[];
    unknown: Feature[];
  };
}[];

// eclair-cli listpendinginvoices
export type ListPendingInvoicesRequest = {
  // Filters elements no older than this unix-timestamp
  from?: number;
  // Filters elements no younger than this unix-timestamp
  to?: number;
};
export type ListPendingInvoicesResponse = {
  prefix: string;
  timestamp: number;
  nodeId: string;
  serialized: string;
  description: string;
  paymentHash: string;
  expiry: number;
  amount: number;
  features: {
    activated: Feature[];
    unknown: Feature[];
  };
}[];

// eclair-cli findroute --invoice=<some_bolt11invoice>
export type FindRouteRequest = {
  // The invoice containing the destination
  invoice: string;
  // The amount that should go through the route
  amountMsat?: number;
};
export type FindRouteResponse = string[];

// eclair-cli --nodeId=<some_node> --amountMsat=<some_amount>
export type FindRouteToNodeRequest = {
  // The destination of the route
  nodeId: string;
  // The amount that should go through the route
  amountMsat: number; // msat
};
export type FindRouteToNodeResponse = string[];

// eclair-cli getnewaddress
export type GetNewAddressResponse = string;

// eclair-cli sendonchain --address=2NEDjKwa56LFcFVjPefuwkN3pyABkMrqpJn --amountSatoshis=25000 --confirmationTarget=6
export type SendOnChainRequest = {
  // The bitcoin address of the recipient
  address: string;
  // The amount that should be sent
  amountSatoshis: number;
  // The confirmation target (blocks)
  confirmationTarget: number;
};
export type SendOnChainResponse = string;

// eclair-cli onchainbalance
export type OnChainBalanceResponse = {
  confirmed: number;
  unconfirmed: number;
};

// eclair-cli onchaintransactions --count=2 --skip=1
export type OnChainTransactionsRequest = {
  // Number of transactions to return
  count?: number;
  // Number of transactions to skip
  skip: number;
};
export type OnChainTransactionsResponse = {
  address: string;
  amount: number;
  fees: number;
  blockHash: string;
  confirmations: number;
  txid: string;
  timestamp: number;
}[];

// eclair-cli signmessage --msg=$(echo -n 'hello world' | base64)
export type SignMessageRequest = {
  // Base64-encoded message to sign
  msg: string;
};
export type SignMessageResponse = {
  nodeId: string;
  message: string;
  signature: string;
};

// eclair-cli verifymessage --msg=$(echo -n 'hello world' | base64) --sig=1f9a6cc947bdb6fc14caae87be6bd76a6877d87cc83a80dec9aa8d1a23d1529fad418ce4ab5a7fb7afcfb351b317deb83d8141e68ba442f4aa4bbb534a8d27f851
export type VerifyMessageRequest = {
  // Base64-encoded message to sign
  msg: string;
  // Message signature
  sig: string;
};
export type VerifyMessageResponse = {
  valid: boolean;
  publicKey: string;
};

// eclair-cli audit
export type AuditRequest = {
  // Filters elements no older than this unix-timestamp
  from?: number;
  // Filters elements no younger than this unix-timestamp
  to?: number;
};
export type AuditResponse = {
  sent: [
    {
      type: string;
      id: string;
      paymentHash: string;
      paymentPreimage: string;
      recipientAmount: number;
      recipientNodeId: string;
      parts: {
        id: string;
        amount: number;
        feesPaid: number;
        toChannelId: string;
        timestamp: number;
      }[];
    },
    {
      type: string;
      id: string;
      paymentHash: string;
      paymentPreimage: string;
      recipientAmount: number;
      recipientNodeId: string;
      parts: {
        id: string;
        amount: number;
        feesPaid: number;
        toChannelId: string;
        timestamp: number;
      }[];
    }
  ];
  received: [
    {
      type: string;
      paymentHash: string;
      parts: {
        amount: number;
        fromChannelId: string;
        timestamp: number;
      }[];
    }
  ];
  relayed: {
    type: string;
    amountIn: number;
    amountOut: number;
    paymentHash: string;
    fromChannelId: string;
    toChannelId: string;
    timestamp: number;
  }[];
};

// eclair-cli networkfees
export type NetworkFeesRequest = {
  // Filters elements no older than this unix-timestamp
  from?: number;
  // Filters elements no younger than this unix-timestamp
  to?: number;
};
export type NetworkFeesResponse = {
  remoteNodeId: string;
  channelId: string;
  txId: string;
  fee: number;
  txType: string;
  timestamp: number;
}[];

// eclair-cli channelstats
export type ChannelStatsRequest = {
  // Filters elements no older than this unix-timestamp
  from?: number;
  // Filters elements no younger than this unix-timestamp
  to?: number;
};
export type ChannelStatsResponse = {
  channelId: string;
  direction: 'IN' | 'OUT';
  avgPaymentAmount: number;
  paymentCount: number;
  relayFee: number;
  networkFee: number;
}[];

// eclair-cli usablebalances
export type UsableBalancesResponse = {
  remoteNodeId: string;
  shortChannelId: string;
  canSend: number;
  canReceive: number;
  isPublic: boolean;
}[];

// Websocket events

// payment-relayed - A payment has been successfully relayed
export type PaymentRelayedWebSocketEvent = {
  type: 'payment-relayed';
  amountIn: number;
  amountOut: number;
  paymentHash: string;
  fromChannelId: string;
  toChannelId: string;
  timestamp: number;
};

// payment-received - A payment has been received
export type PaymentReceivedWebSocketEvent = {
  type: 'payment-received';
  paymentHash: string;
  parts: {
    amount: number;
    fromChannelId: string;
    timestamp: number;
  }[];
};

// payment-sent	- A payment has been successfully sent
export type PaymentSentWebSocketEvent = {
  type: 'payment-sent';
  id: string;
  paymentHash: string;
  paymentPreimage: string;
  recipientAmount: number;
  recipientNodeId: string;
  parts: {
    id: string;
    amount: number;
    feesPaid: number;
    toChannelId: string;
    timestamp: number;
  }[];
};

// payment-settling-onchain	- A payment wasn't fulfilled and its HTLC is being redeemed on-chain
export type PaymentSettlingOnChainWebSocketEvent = {
  type: 'payment-settling-onchain';
  id: string;
  amount: number;
  paymentHash: string;
  timestamp: number;
};

// payment-failed - A payment failed
export type PaymentFailedWebSocketEvent = {
  type: 'payment-failed';
  id: string;
  paymentHash: string;
  failures: []; // TODO: need this data format
  timestamp: number;
};

// channel-opened - A channel opening flow has started
export type ChannelOpenedWebSocketEvent = {
  type: 'channel-opened';
  remoteNodeId: string;
  isFunder: boolean;
  temporaryChannelId: string;
  initialFeeratePerKw: number;
  fundingTxFeeratePerKw: number;
};

// channel-state-changed - A channel state changed (e.g. going from offline to connected)
export type ChannelStateChangedWebSocketEvent = {
  type: 'channel-state-changed';
  channelId: string;
  remoteNodeId: string;
  // TODO: No doubt there are other values that should go here:
  previousState: ChannelState;
  currentState: ChannelState;
};

// channel-closed - A channel has been closed
export type ChannelClosedWebSocketEvent = {
  type: 'channel-closed';
  channelId: string;
  closingType: 'MutualClose' /* TODO: no doubt there are more types */;
};

export type WebSocketEvent =
  | PaymentReceivedWebSocketEvent
  | PaymentSentWebSocketEvent
  | PaymentSettlingOnChainWebSocketEvent
  | PaymentFailedWebSocketEvent
  | ChannelOpenedWebSocketEvent
  | ChannelStateChangedWebSocketEvent
  | ChannelClosedWebSocketEvent;
