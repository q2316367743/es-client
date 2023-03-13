import LodisArgs from "../entity/LodisArgs";
import LodisOptionTypeEnum from "../enumeration/LodisOptionTypeEnum";

export default function LodisHandler(args: LodisArgs): Promise<any> {
    switch (args.option){
        case LodisOptionTypeEnum.GET:
            return Promise.resolve(localStorage.getItem(args.key));
        case LodisOptionTypeEnum.SET:
            localStorage.setItem(args.key, args.value || '');
            return Promise.resolve();
        case LodisOptionTypeEnum.REMOVE:
            localStorage.removeItem(args.key);
            return Promise.resolve();
        default:
            return Promise.resolve();
    }
}