import { format } from "date-fns";
import { channel } from "node:diagnostics_channel";

interface ChannelHeroProps {
  name: string;
  creationTime: number;
}

export const ChannelHero = ({ name, creationTime }: ChannelHeroProps) => {
  return (
    <div className="mx-5 mb-4 mt-[88px]">
      <p className="mb-2 flex items-center text-2xl font-bold"># {name}</p>
      <p className="mb-4 font-normal text-slate-800">
        This channel was created on {format(creationTime, "MMMM do, yyyy")}.
        This is the beginning of the <strong>{name}</strong> channel.
      </p>
    </div>
  );
};
