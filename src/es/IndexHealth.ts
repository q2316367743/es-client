/**
 * 索引健康值
 */
export default interface IndexHealth {

    /**
     * 集群名称
     */
    cluster_name:                     string;

    /**
     * 状态
     */
    status:                           string;

    /**
     * 是否超时
     */
    timed_out:                        boolean;

    /**
     * 节点数
     */
    number_of_nodes:                  number;
    number_of_data_nodes:             number;
    active_primary_shards:            number;
    active_shards:                    number;
    relocating_shards:                number;
    initializing_shards:              number;
    unassigned_shards:                number;
    delayed_unassigned_shards:        number;
    number_of_pending_tasks:          number;
    number_of_in_flight_fetch:        number;
    task_max_waiting_in_queue_millis: number;
    active_shards_percent_as_number:  number;
}