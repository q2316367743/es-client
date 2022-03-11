import Index from '@/view/Index';

/**
 * 策略接口
 */
export default interface Strategy {

    issue(index: Index): any;

}
