const ACTIONS = require('./actions');

module.exports = {
    'START': [
        [ACTIONS['RENT_BIKE'], ACTIONS['CALL_TAXI'], ACTIONS['INSTRUCTOR']],
        // [ACTIONS['EXCHANGE_MONEY']],
        // [ACTIONS['BUY_FRUITS']]
    ],
    'AUTH': [
        [{
            text: ACTIONS['AUTH'],
            request_contact: true,
        }]
    ],
    'BIKES': [
        [
            ACTIONS['BIKE_SCOOPY'],
            ACTIONS['BIKE_BEAT'],
            ACTIONS['BIKE_VARIO'],
        ],
        [
            ACTIONS['BIKE_AEROX'],
            ACTIONS['BIKE_NMAX'],
        ],
        [ACTIONS['BACK']],
    ],
    'TAXI': [
        [
            ACTIONS['CANCEL_TAXI'],
            ACTIONS['CONNECT_TAXI']
        ],
        [{
            text: ACTIONS['LOCATION'],
            request_location: true
        }],
        [ACTIONS['BACK']],
    ],
    'INSTRUCTOR': [
        [ACTIONS['CALL_INSTRUCTOR']],
        [ACTIONS['BACK']],
    ]
};