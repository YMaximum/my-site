import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ConnectionMode,
  ReactFlow,
  getNodesBounds,
  getViewportForBounds,
  type ReactFlowInstance,
  type Viewport,
} from '@xyflow/react';
import { Minus, Plus, Maximize, Pause, Play } from 'lucide-react';
import type { ProjectId } from '../data/portfolio';
import { diagramGraph, type DiagramNode } from '../data/diagrams';
import { diagramNodeTypes } from './diagramNodeTypes';
import PreviewButton from './PreviewButton';

const minimumScale = 0.2;
const maximumScale = 3;

export default function DiagramCanvas({
  project,
  motionEnabled,
}: {
  project: ProjectId;
  motionEnabled: boolean;
}) {
  const canvas = useRef<HTMLDivElement>(null);
  const [flow, setFlow] = useState<ReactFlowInstance<DiagramNode> | null>(null);
  const [view, setView] = useState<Viewport>({ zoom: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const graph = useMemo(() => diagramGraph(project, 700), [project]);
  const animated = motionEnabled && !paused;
  const edges = useMemo(
    () => graph.edges.map((edge) => ({ ...edge, animated })),
    [graph, animated],
  );
  function fit() {
    void flow?.fitView({
      padding: 0.12,
      minZoom: minimumScale,
      maxZoom: 1,
      duration: 0,
    });
  }
  function zoom(factor: number) {
    if (!flow) return;
    void flow.zoomTo(
      Math.max(minimumScale, Math.min(maximumScale, flow.getZoom() * factor)),
      { duration: 0 },
    );
  }
  useEffect(() => {
    if (!flow) return;
    const element = canvas.current!;
    const observer = new ResizeObserver(() => {
      const fitted = getViewportForBounds(
        getNodesBounds(graph.nodes),
        element.clientWidth,
        element.clientHeight,
        minimumScale,
        1,
        0.12,
      );
      const zoom =
        element.clientWidth < 640 && element.clientHeight >= 350
          ? Math.max(0.8, fitted.zoom)
          : fitted.zoom;
      const bounds = getNodesBounds(graph.nodes);
      void flow.setViewport(
        {
          zoom,
          x: (element.clientWidth - bounds.width * zoom) / 2,
          y: (element.clientHeight - bounds.height * zoom) / 2,
        },
        { duration: 0 },
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [flow, graph]);
  return (
    <div className='diagram-preview-canvas'>
      <div
        className='diagram-canvas-toolbar'
        role='group'
        aria-label='Diagram controls'
      >
        <PreviewButton
          className='icon-button'
          label='Zoom out'
          disabled={view.zoom <= minimumScale}
          onActivate={() => zoom(1 / 1.25)}
        >
          <Minus size={18} aria-hidden='true' />
        </PreviewButton>
        <output aria-label='Diagram zoom'>
          {Math.round(view.zoom * 100)}%
        </output>
        <PreviewButton
          className='icon-button'
          label='Zoom in'
          disabled={view.zoom >= maximumScale}
          onActivate={() => zoom(1.25)}
        >
          <Plus size={18} aria-hidden='true' />
        </PreviewButton>
        <PreviewButton
          className='icon-button'
          label='Fit diagram to canvas'
          onActivate={fit}
        >
          <Maximize size={18} aria-hidden='true' />
        </PreviewButton>
        {motionEnabled && (
          <PreviewButton
            className='icon-button'
            label={
              paused
                ? 'Play connection animation'
                : 'Pause connection animation'
            }
            onActivate={() => setPaused(!paused)}
          >
            {paused ? (
              <Play size={18} aria-hidden='true' />
            ) : (
              <Pause size={18} aria-hidden='true' />
            )}
          </PreviewButton>
        )}
      </div>
      <div
        ref={canvas}
        className='diagram-canvas'
        role='region'
        aria-label='System diagram canvas'
        aria-describedby='diagram-canvas-help'
        tabIndex={0}
        data-dragging={dragging}
        data-lines={animated ? 'animated' : 'static'}
        onKeyDown={(event) => {
          if (
            !flow ||
            ![
              'ArrowLeft',
              'ArrowRight',
              'ArrowUp',
              'ArrowDown',
              '+',
              '=',
              '-',
              '0',
              'Home',
            ].includes(event.key)
          )
            return;
          event.preventDefault();
          const key = event.key;
          if (key === '+' || key === '=') zoom(1.25);
          else if (key === '-') zoom(1 / 1.25);
          else if (key === '0' || key === 'Home') fit();
          else {
            const previous = flow.getViewport();
            void flow.setViewport(
              {
                ...previous,
                x:
                  previous.x +
                  (key === 'ArrowRight' ? 40 : key === 'ArrowLeft' ? -40 : 0),
                y:
                  previous.y +
                  (key === 'ArrowDown' ? 40 : key === 'ArrowUp' ? -40 : 0),
              },
              { duration: 0 },
            );
          }
        }}
      >
        <ReactFlow<DiagramNode>
          id={`preview-${project}`}
          nodes={graph.nodes}
          edges={edges}
          nodeTypes={diagramNodeTypes}
          connectionMode={ConnectionMode.Loose}
          onInit={setFlow}
          onMove={(_, viewport) => setView(viewport)}
          onMoveStart={(event) => {
            if (event) setDragging(true);
          }}
          onMoveEnd={() => setDragging(false)}
          minZoom={minimumScale}
          maxZoom={maximumScale}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          elementsSelectable={false}
          zoomOnDoubleClick={false}
          panOnDrag
          zoomOnScroll
          zoomOnPinch
          preventScrolling
          disableKeyboardA11y
          proOptions={{ hideAttribution: true }}
        />
      </div>
      <p id='diagram-canvas-help' className='diagram-canvas-help'>
        Drag to pan · Scroll or pinch to zoom · Arrow keys to move · +/− to zoom
        · 0 to fit
      </p>
    </div>
  );
}
