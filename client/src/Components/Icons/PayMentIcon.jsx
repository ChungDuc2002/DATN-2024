import React from 'react';
import Icon from '@ant-design/icons';

const PayMentSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width="64"
    height="60"
    style={{
      shapeRendering: 'geometricPrecision',
      textRendering: 'geometricPrecision',
      imageRendering: 'optimizeQuality',
      fillRule: 'evenodd',
      clipRule: 'evenodd',
    }}
    version="1.0"
    viewBox="0 0 13838 6857"
  >
    <g>
      <path
        fill="#000"
        d="m1946 850 1702 24 840-212c18-4 35-6 52-6v-1h1693l525-583 65-72h1882l52 30 1464 845 1672-9V635h1946v3925h-1946v-415h-1013l-1091 515 329 345c82 86 78 223-8 305-21 20-44 34-69 44L6459 6842c-81 34-172 14-232-44L3162 4143l-1215-22v439H1V635h1946v216zm11244 2393v433h-433v-433h433zm-12109 0v433H648v-433h433zm10811-1948-1729 9h-58l-50-29-1462-844H7015l-514 571-1 1-3 4-17 19-1541 1712c-26 65-20 142 10 213 27 64 74 125 134 173 61 48 135 84 217 96 140 22 309-20 488-164l13-9 1340-927 152-105 127 135 2056 2179 1265-597 45-21h1107V1295zm1514-230h-1081v3060h1081V1065zM6097 5337c-89-79-97-215-19-304 79-89 215-97 304-19l1068 946 395-164-918-814c-89-79-97-215-19-304 79-89 215-97 304-19l1075 953 432-179-879-779c-89-79-97-215-19-304 79-89 215-97 304-19l1036 918 426-177-211-221-1 1-107-113-1-1-3-3-4-4-2030-2151-1178 815c-283 227-572 290-821 251-161-25-304-92-419-184-116-92-207-212-262-341-82-193-87-411 14-603l13-25 18-19 1248-1386H4565l-838 211v-1c-17 4-36 7-55 6l-1727-24v2409l1301 23 13 1 7 1 12 2 6 1 7 2 5 1 26 9 4 2c20 8 39 20 56 35l3031 2626 592-246-911-807zM1513 1065H432v3060h1081V1065z"
      />
    </g>
  </svg>
);

const PayMentIcon = (props) => <Icon component={PayMentSvg} {...props} />;

export default PayMentIcon;
