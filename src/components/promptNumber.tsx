import { h } from "preact";
import Dropdown from "./dropdown";
import { range } from "lodash-es";

interface Props {
  num: string;
  numHandler: (num: string) => void;
}

const PrmoptNumber = (props: Props) => {
  const { num, numHandler } = props;
  const options = range(10).map((num) => ({
    value: num.toString(),
    label: num.toString(),
  }));
  return (
    <div class="wcg-flex wcg-flex-row wcg-items-center wcg-mt-6">
      <div class="wcg-text-2xl wcg-whitepace-nowrap wcg-font-bold">
        Number of search results
      </div>
      <div class="wcg-ml-2">
        <Dropdown
          options={options}
          value={num}
          onChange={(e) => {
            numHandler(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default PrmoptNumber;
