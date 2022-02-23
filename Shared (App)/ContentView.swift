//
//  ContentView.swift
//  Purity
//
//  Created by Helloyunho on 2022/02/23.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Image("Icon")
                .resizable()
                .frame(width: 64.0, height: 64.0)
            Text("Purity")
                .font(.largeTitle)
                .fontWeight(.bold)
        }
        #if os(macOS)
        .frame(maxWidth: 800, maxHeight: 600)
        #endif
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
