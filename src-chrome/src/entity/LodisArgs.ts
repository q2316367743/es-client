import LodisOptionTypeEnum from "../enumeration/LodisOptionTypeEnum";
import BaseArgs from "./BaseArgs";

export default interface LodisArgs extends BaseArgs{

    option: LodisOptionTypeEnum;

    key: string;

    value?: string;

}