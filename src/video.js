import { useCurrentFrame, useVideoConfig } from "remotion";
import { RepoHeader } from "./repo-header";
import { useProgress } from "./nerd";
import { inputProps } from "./props";
import { Img } from "remotion";

export function Video({ repoOrg, repoName, stargazers }) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const extraEnding = +fps;

  const progress = useProgress(
    frame,
    durationInFrames - extraEnding,
    stargazers.length,
    fps
  );

  return (
    <Content
      stargazers={stargazers}
      repoOrg={repoOrg}
      repoName={repoName}
      progress={progress}
    />
  );
}

function Content({ stargazers, repoOrg, repoName, progress }) {
  const gap = 102;
  const startY = 76 - gap;
  const dy = progress * gap;
  const { width, height } = useVideoConfig();
  const relativeWidth = width / inputProps.scale;
  const relativeHeight = height / inputProps.scale;

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#f6f8fa",
        position: "relative",
        maxWidth: relativeWidth,
        maxHeight: relativeHeight,
        transformOrigin: "top left",
        transform: `scale(${inputProps.scale})`,
      }}
    >
      {stargazers.map((stargazer, index) => {
        const y = startY - gap * index + dy
        const isHidden = progress - index <= -2 || y > height;
        // const grow =
        //   index + 1 > progress ? 1 : Math.max(0, index + 2 - progress);
        const grow = 0;
        const opacity = Math.min(0.1 + progress - index, 1);
        return isHidden ? null : (
          <StarBox
            avatarUrl={stargazer.avatarUrl}
            name={stargazer.name}
            login={stargazer.login}
            date={stargazer.date}
            repoName={repoName}
            y={y}
            grow={grow}
            opacity={opacity}
            key={stargazer.name}
            starNumber={index + 1}
          />
        );
      })}

      <RepoHeader stars={Math.round(progress)} org={repoOrg} name={repoName} />
    </div>
  );
}

function StarBox({
  avatarUrl,
  name,
  login,
  date,
  repoName,
  y,
  starNumber,
  grow,
  opacity,
}) {
  const d = new Date(date);
  const dateString = d.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div
      style={{
        // margin: "24px",
        background: "white",
        border: "1px solid #e1e4e8",
        borderRadius: 6,
        padding: 12,
        display: "flex",
        position: "absolute",
        opacity,
        top: 0,
        right: 24,
        left: 24,
        transform: `translateY(${y}px) scale(${1 + grow * 0.07})`,
      }}
    >
      <Img
        width="64"
        height="64"
        src={avatarUrl}
        style={{ borderRadius: "50%" }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "12px",
          flex: 1,
          // maxWidth: 560,
          minWidth: 0,
        }}
      >
        <h3
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            // maxWidth: 360,
            fontWeight: 400,
          }}
        >
          <b>{name}</b> {inputProps.showLogin && login && <span style={{ color: "#586069" }}>({ login })</span>}
        </h3>
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          starred {inputProps.showRepo && <b>{repoName}</b>}{" "}
          <span style={{ color: "#586069" }}>on {dateString}</span>
        </div>
      </div>
      <div
        style={{
          width: 64,
          height: 64,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "0.8em", color: "#586069" }}>Star</span>
        <div style={{ fontSize: "1.2em" }}>
          <span style={{ fontSize: "1em", color: "#586069" }}>#</span>
          {starNumber}
        </div>
      </div>
    </div>
  );
}
