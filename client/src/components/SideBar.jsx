import { BsPlus, BsFillLightningFill, BsGearFill } from "react-icons/bs";
import { FaFire, FaDiceOne, FaHome } from "react-icons/fa";
import styles from "./SideBar.module.css";
import { v4 as uuidV4 } from "uuid";

const SideBar = () => {
  return (
    <div
      className="fixed top-0 left-0 h-screen w-16 flex flex-col
    bg-white dark:bg-gray-900 shadow-lg"
    >
      <SideBarIcon text="Home" link="/" icon={<FaHome size="28" />} />
      <Divider />
      <SideBarIcon
        text="New Document"
        link={`/${uuidV4()}`}
        icon={<BsPlus size="32" />}
      />
      <SideBarIcon icon={<BsFillLightningFill size="20" />} />
      <SideBarIcon icon={<FaDiceOne size="20" />} />
      <Divider />
      <SideBarIcon text="Settings" icon={<BsGearFill size="22" />} />
    </div>
  );
};

const SideBarIcon = ({ icon, text = "tooltip 💡", link }) => (
  <div className="sidebar-icon group">
    <a href={`${link}`}>{icon}</a>
    <span class="sidebar-tooltip group-hover:scale-100">{text}</span>
  </div>
);

const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;
