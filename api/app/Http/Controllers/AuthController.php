<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;



class AuthController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        error_log($request->getContent());

        $field = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);
        $user = User::where('email', $field["email"]) ->first();

        if(!$user || !Hash::check($field['password'], $user->password)){
            return response([
                'message' => "Unauthorized"
            ], 401);
        }

        $token = $user->createToken('accessToken')->plainTextToken; 
        $response = [
            'user' => $user,
            'token' => $token
        ];

        
        return response($response, 200);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {   error_log($request->getContent());
        $field = $request->validate([
            'username' => 'required|string',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string|confirmed',
            
        ]);

         User::create([
            'username' =>  $field['username'],
            'email' =>  $field['email'],
            'password' =>  bcrypt($field['password']),
            'stock' => json_encode (json_decode ("{}"))
        ]);


        $response = [
            'message' => "Account Created"
        ];

        return response($response, 201);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();

        $response = ['message' => 'Logged Out'];
        return response($response, 200);
    }



    
}
