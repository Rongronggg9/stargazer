import {
  Composition,
  continueRender,
  delayRender,
  registerRoot,
  Config,
} from "remotion";
import { Video } from "./video";
import { fetchStargazers } from "./fetch";
import { inputProps } from "./props";

// improve quality
Config.Rendering.setImageFormat("png");
// speed up: GHA hosted runners have two cores
Config.Rendering.setConcurrency(2);

function RemotionVideo() {
  const [handle] = React.useState(() => delayRender());
  const [stargazers, setStargazers] = React.useState([]);

  React.useEffect(() => {
    const { repoOrg, repoName, starCount } = inputProps;
    fetchStargazers(repoOrg, repoName, starCount).then((stargazers) => {
      setStargazers(stargazers);
      continueRender(handle);
    });
  }, [handle]);

  return (
    <Composition
      id="main"
      component={Video}
      durationInFrames={inputProps.fps * inputProps.duration}
      fps={inputProps.fps}
      width={inputProps.width}
      height={inputProps.height}
      defaultProps={{
        ...inputProps,
        stargazers,
      }}
    />
  );
}

registerRoot(RemotionVideo);
