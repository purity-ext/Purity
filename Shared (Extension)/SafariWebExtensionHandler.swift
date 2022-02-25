//
//  SafariWebExtensionHandler.swift
//  Shared (Extension)
//
//  Created by Helloyunho on 2022/02/19.
//

import SafariServices

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

    func beginRequest(with context: NSExtensionContext) {
        let item = context.inputItems[0] as! NSExtensionItem
        let requests = item.userInfo?["message"] as? [String: Any]
        if requests?["isSafari"] != nil {
            let response = NSExtensionItem()
            response.userInfo = ["message": ["isSafari": true]]

            context.completeRequest(returningItems: [response], completionHandler: nil)
            return
        }
        context.completeRequest(returningItems: nil, completionHandler: nil)
    }

}
