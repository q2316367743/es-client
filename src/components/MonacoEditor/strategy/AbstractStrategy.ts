import Index from '@/view/Index';
import StrategyContext from './StrategyContext';

export default abstract class AbstractStrategy {

    constructor(name: string) {
        StrategyContext.register(name, this);
    }

    abstract issue(index: Index): any;

}
