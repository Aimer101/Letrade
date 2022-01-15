<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Transaction;


class TransactionController extends Controller
{
    /**
     *Buying route.
     *
     * @return \Illuminate\Http\Response
     */
    public function buy(Request $request)
    {
        
        $item = json_decode($request->getContent());

        $transactionDetail = [
            'userId' => $item->userId,
        'ticker' => $item->stock,
        'price' => $item->marketPrice,
        'quantity' => $item->quantity,
        'action' => "BUY"

        ];

        $user = User::find($item->userId);
        $stock = json_decode($user-> stock, true);

        Transaction::create($transactionDetail);
        $user->balance = $user->balance - ($item->quantity * $item->marketPrice);
        
        if(array_key_exists($item->stock, $stock)){

            $avgPrice = [
                'total' => $item->quantity * $item->marketPrice + $stock[$item->stock]["total"],
                'quantity' => $item -> quantity + $stock[$item->stock]["quantity"]
            ];

            $stock[$item -> stock] = $avgPrice;
            $user->stock = json_encode($stock);

            $user->save();


            return response($user, 200);

        }else{
            
            $avgPrice = [
                'total' => $item->quantity * $item->marketPrice,
                'quantity' => $item -> quantity
            ];

            $stock[$item -> stock] = $avgPrice;

            $user->stock = json_encode($stock);

            $user->save();

            return response(($user), 200);
        }
    }

    /**
     *Sell route.
     *
     * @return \Illuminate\Http\Response
     */
    
    public function sell(Request $request)
    {

        $item = json_decode($request->getContent());

        $transactionDetail = [
            'userId' => $item->userId,
        'ticker' => $item->stock,
        'price' => $item->marketPrice,
        'quantity' => $item->quantity,
        'action' => "SELL"

        ];

        Transaction::create($transactionDetail);
        $user = User::find($item->userId);
        $stock = json_decode($user-> stock, true);
        $user->balance = $user->balance + ($item->quantity * $item->marketPrice);

        $avgPrice = [
            'total' => -$item->quantity * $item->marketPrice + $stock[$item->stock]["total"],
            'quantity' => -$item -> quantity + $stock[$item->stock]["quantity"]
        ];

        if($avgPrice['quantity'] == 0 ){
            unset($stock[$item -> stock]);
            $user->stock = json_encode($stock);
            $user->save();

            return response(($user), 200);
            
        }else{
            $stock[$item -> stock] = $avgPrice;

            $user->stock = json_encode($stock);

            $user->save();

            return response(($user), 200);

        }
    }

    /**
     *History route.
     *
     * @return \Illuminate\Http\Response
     */
    public function history(Request $request, $userId)
    {
        $item = Transaction::where('userId', ($userId))->latest()->get();
        return response($item, 200);

    }

    
    
}
