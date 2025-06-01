<?php

namespace App\Events;

use App\Models\Antrian;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AntrianUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $antrian;

    public function __construct(Antrian $antrian)
    {
        $this->antrian = $antrian;
    }

    public function broadcastOn()
    {
        logger()->info('Pusher config:', [
            'host' => config('broadcasting.connections.pusher.options.host'),
            'port' => config('broadcasting.connections.pusher.options.port'),
            'scheme' => config('broadcasting.connections.pusher.options.scheme') ?? 'https',
        ]);

        return new Channel('antrian');
    }


    public function broadcastWith()
    {
        return [
            'id' => $this->antrian->id,
            'nomor_antrian' => $this->antrian->nomor_antrian,
            'status' => $this->antrian->status,
        ];
    }

    public function broadcastAs()
    {
        return 'AntrianUpdated';
    }
}