import { Avatar, Card } from "@/components/ui";
import { HiBriefcase, HiOutlineTag, HiShieldExclamation, HiTicket, HiUserCircle } from "react-icons/hi";
import {
	RiBankLine,
	RiVirusFill,
	RiHotelFill,
	RiHandHeartLine,
	RiHandCoinLine,
	RiHomeGearLine,
	RiCheckboxMultipleBlankFill
} from "react-icons/ri";

const StatisticIcon = ({ type }) => {
	switch (type) {
		case " Leasing Insurance Company":
			return (
				<Avatar
					size={55}
					className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
					icon={<RiCheckboxMultipleBlankFill/>}
				/>
			);
			case " Damage Insurance Company":
			return (
				<Avatar
					size={55}
					className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100"
					icon={<HiShieldExclamation />}
				/>
			);
		case "Accident Case":
			return (
				<Avatar
					size={55}
					className="bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-100"
					icon={<HiTicket />}
				/>
			);
			case "Business Case":
			return (
				<Avatar
					size={55}
					className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100"
					icon={<HiBriefcase/>}
				/>
			);
		case "Insurance Company":
			return (
				<Avatar
					size={55}
					className="bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-100"
					icon={<RiHotelFill />}
				/>
			);
		case "Tow Service":
			return (
				<Avatar
					size={55}
					className="bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-100"
					icon={<RiVirusFill />}
				/>
			);
		case "Workshop":
			return (
				<Avatar
					size={55}
					className="bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-100"
					icon={<RiBankLine />}
				/>
			);
		case "Region":
			return (
				<Avatar
					size={55}
					className="bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-100"
					icon={<RiHomeGearLine />}
				/>
			);
		case "Business Agents":
			return (
				<Avatar
					size={55}
					className="bg-lime-100 text-lime-600 dark:bg-lime-500/20 dark:text-lime-100"
					icon={<RiHandHeartLine />}
				/>
			);
		case "Sale Agents":
			return (
				<Avatar
					size={55}
					className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100"
					icon={<RiHandCoinLine />}
				/>
			);
		
		default:
			return <div></div>;
	}
};

const StatisticCard = ({ data = {} }) => {
	return (
		<Card>
			<div className="flex items-center gap-4">
				<StatisticIcon type={data.key} />
				<div className="flex flex-col gap-0.5 justify-between">
					<h3 className="font-bold leading-none">{data.value}</h3>
					<p className="font-semibold">{data.label}</p>
				</div>
			</div>
		</Card>
	);
};

const Statistic = ({ data = [] }) => {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
			{data.map((card) => (
				<StatisticCard key={card.key} data={card} />
			))}
		</div>
	);
};

export default Statistic;
