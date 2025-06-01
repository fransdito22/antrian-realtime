<?php

namespace App\Http\Controllers;

use App\Models\Antrian;
use App\Events\AntrianUpdated;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AntrianController extends Controller
{
    public function index()
    {
        $antrians = Antrian::latest()->get();

        $url = "http://localhost:8000/ambil-antrian";

        return Inertia::render('Admin/Dashboard', [
            'antrians' => $antrians,
            'qr' => $url,
        ]);
    }

    public function ambilDariQr()
    {
        $last = Antrian::latest()->first();
        $nextNumber = $last
            ? 'A' . str_pad(((int)substr($last->nomor_antrian, 1)) + 1, 3, '0', STR_PAD_LEFT)
            : 'A001';

        $antrian = Antrian::create([
            'nomor_antrian' => $nextNumber,
            'status' => 'menunggu',
        ]);

        broadcast(new AntrianUpdated($antrian))->toOthers();

        return Inertia::render('User/Tiket', [
            'nomor_antrian' => $antrian->nomor_antrian,
        ]);
    }

    public function updateStatus(Antrian $antrian)
    {
        $antrian->update(['status' => 'selesai']);

        broadcast(new AntrianUpdated($antrian))->toOthers();

        return back();
    }

    public function proses($id)
    {
        $antrian = Antrian::findOrFail($id);
        $antrian->update(['status' => 'dipanggil']);

        broadcast(new AntrianUpdated($antrian))->toOthers();

        return redirect()->route('dashboard');
    }

}