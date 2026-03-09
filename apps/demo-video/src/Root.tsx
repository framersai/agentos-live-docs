import React from 'react';
import { Composition } from 'remotion';
import { DemoVideo } from './DemoVideo';
import { FPS, WIDTH, HEIGHT, TOTAL_DURATION } from './theme/timing';
import { WorkbenchDemo } from './WorkbenchDemo';
import { WB_TOTAL_DURATION } from './theme/wb-timing';
import { DemoStreaming } from './scenes/demos/DemoStreaming';
import { DemoAgentCreation, DEMO_AGENT_CREATION_DURATION } from './scenes/demos/DemoAgentCreation';
import { DemoMultiAgent } from './scenes/demos/DemoMultiAgent';
import { DemoRagMemory } from './scenes/demos/DemoRagMemory';
import { DemoPlanningEngine } from './scenes/demos/DemoPlanningEngine';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DemoVideo"
        component={DemoVideo}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="WorkbenchDemo"
        component={WorkbenchDemo}
        durationInFrames={WB_TOTAL_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="DemoStreaming"
        component={DemoStreaming}
        durationInFrames={1320}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="DemoAgentCreation"
        component={DemoAgentCreation}
        durationInFrames={DEMO_AGENT_CREATION_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="DemoMultiAgent"
        component={DemoMultiAgent}
        durationInFrames={1312}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="DemoRagMemory"
        component={DemoRagMemory}
        durationInFrames={991}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="DemoPlanningEngine"
        component={DemoPlanningEngine}
        durationInFrames={1103}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
