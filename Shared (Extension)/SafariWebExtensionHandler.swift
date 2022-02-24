//
//  SafariWebExtensionHandler.swift
//  Shared (Extension)
//
//  Created by Helloyunho on 2022/02/19.
//

import SafariServices

let SFExtensionMessageKey = "message"

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

    func beginRequest(with context: NSExtensionContext) {
        let item = context.inputItems[0] as! NSExtensionItem
        if item.userInfo?["isSafari"] != nil {
            let response = NSExtensionItem()
            response.userInfo = ["isSafari": true]

            context.completeRequest(returningItems: [response], completionHandler: nil)
        }
    }

}
