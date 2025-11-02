<?php

namespace App\Enums;

enum TransactionType: string
{
    case ENTRY = 'ENTRY';
    case EXIT = 'EXIT';
}
