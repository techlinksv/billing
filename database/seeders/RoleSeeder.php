<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = ['admin','encargado','vendedor'];
        $models = [
            // API
            'Batch', 'Category','Client','Country','Credit','Item','Movement','Order',
            'Payment','Permision','Product','Role','Transaction','User','Warehouse',
            // Frontend
            'AddClient',
            'ManageCredits',
            'ManagePayments',
            'ManageInvoices',
            'Products',
            'Reports',
            'ManageUser',
            'AddReminder',
            'ManageExpenses',
            'ManageIncomes'
        ];

        foreach($roles as $role){
            DB::table('roles')->insert([
                'role' => $role,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        foreach(\App\Models\Role::all() as $role){
            foreach ($models as $model) {
                DB::table('permisions')->insert([
                    'model' => $model,
                    'class' => 'App\\Models\\' . $model,
                    'role_id' => $role->id,
                    'view' => true,
                    'browse' => true,
                    'create' => true,
                    'update' => true,
                    'delete' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
      
     
    }
}
