import { Label } from "../ui/label";
import { DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";
import { useState } from "react";


function ShoppingOrderDetailsView() {
    return (
        <DialogContent className="sm:max-w-[600px]">
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <div className="flex mt-6 items-center justify-between">
                        <p className="font-medium">Order Id</p>
                        <Label>12345</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Order Date</p>
                        <Label>2023-01-01</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Order Status</p>
                        <Label>Shipped</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Order Price</p>
                        <Label>$100.00</Label>
                    </div>
                </div>
                <Separator />
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium">Order Details</div>
                        <ul className="grid gap-3">
                            <li className="flex items-center justify-between">
                                <span>Product 1</span>
                                <span>$50.00</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <span>Product 2</span>
                                <span>$50.00</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium">Shipping Information</div>
                        <div className="grid gap-0.5 text-muted-foreground">
                            <span>John Doe</span>
                            <span>Address</span>
                            <span>City</span>
                            <span>Pincode</span>
                            <span>Phone Number</span>
                            <span>Notes</span>
                        </div>
                    </div>
                </div>
                <div>
            </div>
            </div>
        </DialogContent>
    )
}

export default ShoppingOrderDetailsView;